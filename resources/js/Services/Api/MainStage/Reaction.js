import ApiBase from '../ApiBase';

class Reaction extends ApiBase {
    route = '/main-stage/sessions/:session/reactions';
}

export default new Reaction;
