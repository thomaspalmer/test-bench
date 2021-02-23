import ApiBase from '../ApiBase';

class Groups extends ApiBase {
    route = '/teams/:team/groups';
}

export default new Groups();
