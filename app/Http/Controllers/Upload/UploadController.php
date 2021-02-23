<?php

namespace App\Http\Controllers\Upload;

use App\Http\Resources\Upload\UploadResource;
use Aws\Command;
use Aws\S3\S3Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use InvalidArgumentException;
use App\Http\Controllers\Controller;
use Psr\Http\Message\RequestInterface;

class UploadController extends Controller
{
    /**
     * @var array
     */
    protected $env = [];

    /**
     * Create a new signed URL.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request)
    {
        $this->env = [
            'AWS_BUCKET' => getenv('AWS_BUCKET'),
            'AWS_DEFAULT_REGION' => getenv('AWS_DEFAULT_REGION'),
            'AWS_ACCESS_KEY_ID' => getenv('AWS_ACCESS_KEY_ID'),
            'AWS_SECRET_ACCESS_KEY' => getenv('AWS_SECRET_ACCESS_KEY'),
        ];

        $this->ensureEnvironmentVariablesAreAvailable($request);

        $bucket = $request->input('bucket') ?: $this->env['AWS_BUCKET'];

        $client = $this->storageClient();

        $uuid = (string)Str::uuid();

        $signedRequest = $client->createPresignedRequest(
            $this->createCommand($request, $client, $bucket, $key = ('tmp/' . $uuid)),
            '+5 minutes'
        );

        $uri = $signedRequest->getUri();

        return (new UploadResource(new Collection([
            'uuid' => $uuid,
            'bucket' => $bucket,
            'key' => $key,
            'url' => 'https://' . $uri->getHost() . $uri->getPath() . '?' . $uri->getQuery(),
            'headers' => $this->headers($request, $signedRequest),
        ])))->response()->setStatusCode(201);
    }

    /**
     * Create a command for the PUT operation.
     *
     * @param Request $request
     * @param S3Client $client
     * @param string $bucket
     * @param string $key
     * @return Command
     */
    protected function createCommand(Request $request, S3Client $client, $bucket, $key)
    {
        return $client->getCommand('putObject', array_filter([
            'Bucket' => $bucket,
            'Key' => $key,
            'ACL' => $request->input('visibility') ?: $this->defaultVisibility(),
            'ContentType' => $request->input('content_type') ?: 'application/octet-stream',
            'CacheControl' => $request->input('cache_control') ?: null,
            'Expires' => $request->input('expires') ?: null,
            'Metadata' => $request->input('metadata') ?: [],
        ]));
    }

    /**
     * Get the headers that should be used when making the signed request.
     *
     * @param Request $request
     * @param RequestInterface $signedRequest
     * @return array
     */
    protected function headers(Request $request, RequestInterface $signedRequest)
    {
        return array_merge(
            $signedRequest->getHeaders(),
            [
                'Content-Type' => $request->input('content_type') ?: 'application/octet-stream'
            ]
        );
    }

    /**
     * Ensure the required environment variables are available.
     *
     * @param Request $request
     * @return void
     */
    protected function ensureEnvironmentVariablesAreAvailable(Request $request)
    {
        $missing = array_diff_key(array_flip(array_filter([
            $request->input('bucket') ? null : 'AWS_BUCKET',
            'AWS_DEFAULT_REGION',
            'AWS_ACCESS_KEY_ID',
            'AWS_SECRET_ACCESS_KEY'
        ])), $this->env);

        if (empty($missing)) {
            return;
        }

        throw new InvalidArgumentException(
            "Unable to issue signed URL. Missing environment variables: " . implode(', ', array_keys($missing))
        );
    }

    /**
     * Get the S3 storage client instance.
     *
     * @return S3Client
     */
    protected function storageClient()
    {
        $config = [
            'region' => $this->env['AWS_DEFAULT_REGION'],
            'version' => 'latest',
            'signature_version' => 'v4',
        ];

        if (!isset($this->env['AWS_LAMBDA_FUNCTION_VERSION'])) {
            $config['credentials'] = array_filter([
                'key' => $this->env['AWS_ACCESS_KEY_ID'] ?? null,
                'secret' => $this->env['AWS_SECRET_ACCESS_KEY'] ?? null,
                'token' => $this->env['AWS_SESSION_TOKEN'] ?? null,
            ]);
        }

        return S3Client::factory($config);
    }

    /**
     * Get the default visibility for uploads.
     *
     * @return string
     */
    protected function defaultVisibility()
    {
        return 'private';
    }
}
