import ApiBase from '../ApiBase';

class Poll extends ApiBase {
    route = 'admin/main-stage/sessions/:session/polls';
}

export default new Poll;
