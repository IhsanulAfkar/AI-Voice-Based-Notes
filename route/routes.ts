import { TRoutes } from "@/types"
const routes: TRoutes = {
    'signin': {
        path: '/auth/signin'
    },
    'signup': {
        path: '/auth/signup'
    },
    'dashboard': {
        path: "/dashboard"
    },
    'dashboard.conversation': {
        path: "/dashboard/{conversationId}"
    },
}
export default routes