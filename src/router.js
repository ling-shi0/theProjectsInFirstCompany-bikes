import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

//统一页
const home = (r) => require.ensure([], () => r(require("@/modules/Home")));
const notFound = (r) => require.ensure([], () => r(require("@/modules/404")));
const vehicleListConfig = (r) =>
  require.ensure([], () => r(require("@/modules/vehicleListConfig")));
const taskConfig = (r) =>
  require.ensure([], () => r(require("@/modules/taskConfig")));
const strategyConfig = r =>
  require.ensure([], () => r(require("@/modules/strategyConfig")));

// page
// const personList = (r) =>
//   require.ensure([], () => r(require("@/modules/page/personList")));
const TabPages = (r) =>
  require.ensure([], () => r(require("@/modules/TabPages")));
const caseManage = (r) =>
  require.ensure([], () => r(require("@/modules/page/caseManage")));
const formerStaff = (r) =>
  require.ensure([], () => r(require("@/modules/page/formerStaff")));

// children
const researchReport = (r) =>
  require.ensure([], () =>
    r(require("@/modules/page/children/researchReport"))
  );
const clueManage = (r) =>
  require.ensure([], () =>
    r(require("@/modules/page/children/clueManage/index"))
  );

// children/children
const clueDetails = (r) =>
  require.ensure([], () =>
    r(require("@/modules/page/children/children/clueDetails"))
  );
const clueSearch = (r) =>
  require.ensure([], () =>
    r(require("@/modules/page/children/children/clueSearch"))
  );
const clusterAnalysis = (r) =>
  require.ensure([], () =>
    r(require("@/modules/page/children/children/clusterAnalysis"))
  );
const caseIntelligence = (r) =>
  require.ensure([], () =>
    r(require("@/modules/page/children/children/caseIntelligence"))
  );
const searchCar = (r) =>
  require.ensure([], () => r(require("@/modules/page/searchCar/FeatureSearchCar.vue")));

// test
// const test = r => require.ensure([], () => r(require('@/modules/template')));

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/home/personList"
    },
    {
      path: "/home",
      name: "home",
      component: home,
      meta: {
        title: "home页面"
      },
      children: [
        {
          path: "personList",
          name: "personList",
          component: TabPages,
          meta: {
            auth: false,
            title: "电动车打击盗窃"
          }
        },
        {
          path: "researchReport",
          name: "researchReport",
          component: researchReport,
          meta: {
            auth: false,
            title: "研判报告"
          }
        },
        {
          path: "clueManage",
          name: "clueManage",
          component: clueManage,
          meta: {
            auth: false,
            title: "线索管理"
          }
        },
        {
          path: "clueDetails",
          name: "clueDetails",
          component: clueDetails,
          meta: {
            auth: false,
            title: "线索详情"
          }
        },
        {
          path: "clueSearch",
          name: "clueSearch",
          component: clueSearch,
          meta: {
            auth: false,
            title: "线索查询"
          }
        },
        {
          path: "clusterAnalysis",
          name: "clusterAnalysis",
          component: clusterAnalysis,
          meta: {
            auth: false,
            title: "线索查询"
          }
        },
        {
          path: "caseIntelligence",
          name: "caseIntelligence",
          component: caseIntelligence,
          meta: {
            auth: false,
            title: "周边案件"
          }
        },
        {
          path: "caseManage",
          name: "caseManage",
          component: caseManage,
          meta: {
            auth: false,
            title: "案件管理"
          }
        },
        {
          path: "formerStaff",
          name: "formerStaff",
          component: formerStaff,
          meta: {
            auth: false,
            title: "前科人员"
          }
        }
        // {
        //   path: 'test',
        //   name: 'test',
        //   component: test,
        //   meta: {
        //     auth: false,
        //     title: 'test页面'
        //   }
        // }
      ]
    },
    {
      path: "/searchCar",
      name: "searchCar",
      component: searchCar,
      meta: {
        title: "以车搜车"
      }
    },
    {
      path: "/404",
      name: "404",
      component: notFound,
      meta: {
        title: "notFound"
      }
    },
    {
      path: "/vehicleListConfig",
      name: "vehicleListConfig",
      component: vehicleListConfig,
      meta: {
        title: "电动车名单库配置"
      }
    },
    {
      path: "/taskConfig",
      name: "taskConfig",
      component: taskConfig,
      meta: {
        title: "任务配置"
      }
    },
    {
      path: "/strategyConfig",
      name: "strategyConfig",
      component: strategyConfig,
      meta: {
        title: "策略配置"
      }
    }
  ]
});
