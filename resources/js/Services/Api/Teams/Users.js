import ApiBase from '../ApiBase';

class Users extends ApiBase {
    route = '/teams/:team/users';
}

export default new Users();
