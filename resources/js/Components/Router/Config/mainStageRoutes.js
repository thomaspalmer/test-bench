import MainStage from 'Pages/MainStage';

import AdminMainStage from 'Pages/Admin/MainStage';
import AdminMainStageStore from 'Pages/Admin/MainStage/Store';
import AdminMainStageChat from 'Pages/Admin/MainStage/Chat';
import AdminMainStageReactions from 'Pages/Admin/MainStage/Reactions';
import AdminMainStagePolls from 'Pages/Admin/MainStage/Polls';
import AdminMainStagePollsStore from 'Pages/Admin/MainStage/Polls/Store';
import AdminMainStagePollsResults from 'Pages/Admin/MainStage/Polls/Results';

export default [
    // Frontend
    { path: '/main-stage', component: MainStage, guards: ['auth'] },

    // Admin
    { path: '/admin/main-stage', component: AdminMainStage, guards: ['admin'] },
    { path: '/admin/main-stage/store/:session?', component: AdminMainStageStore, guards: ['admin'] },
    { path: '/admin/main-stage/chat/:session', component: AdminMainStageChat, guards: ['admin'] },
    { path: '/admin/main-stage/reactions/:session', component: AdminMainStageReactions, guards: ['admin'] },
    { path: '/admin/main-stage/polls/:session', component: AdminMainStagePolls, guards: ['admin'] },
    { path: '/admin/main-stage/polls/:session/store/:poll?', component: AdminMainStagePollsStore, guards: ['admin'] },
    { path: '/admin/main-stage/polls/:session/results/:poll?', component: AdminMainStagePollsResults, guards: ['admin'] },
];
