import ApiBase from '../ApiBase';

class Chat extends ApiBase {
    route = '/main-stage/sessions/:session/chats';
}

export default new Chat;
