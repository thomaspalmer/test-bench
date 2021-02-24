import ApiBase from '../../ApiBase';

class Reactions extends ApiBase {
    route = '/admin/main-stage/sessions/:session/reactions';
}

export default new Reactions();
