import ApiBase from '../../ApiBase';

class Chat extends ApiBase {
    route = '/admin/main-stage/sessions/{session}/chat';
}

export default new Chat();
