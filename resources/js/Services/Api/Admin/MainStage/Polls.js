import ApiBase from '../../ApiBase';

class Polls extends ApiBase {
    route = '/admin/main-stage/sessions/:session/polls';
}

export default new Polls();
