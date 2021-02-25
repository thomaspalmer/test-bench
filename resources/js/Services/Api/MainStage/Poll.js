import ApiBase from '../ApiBase';

class Poll extends ApiBase {
    route = '/main-stage/sessions/:session/poll-submissions';
}

export default new Poll;
