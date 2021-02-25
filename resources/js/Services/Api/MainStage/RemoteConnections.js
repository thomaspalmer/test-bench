import ApiBase from '../ApiBase';

class RemoteConnections extends ApiBase {
    route = '/main-stage/sessions/:session/remote-connections';
}

export default new RemoteConnections;
