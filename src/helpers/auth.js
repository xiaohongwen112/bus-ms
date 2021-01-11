import { getCurrentuser } from '@/pages/settings/service';
import { userPermission, getRoleId } from '@/pages/settings/utils';

const goToSSO = () => {
  location.replace('/zh-cn/accounts/login/');
};

/* 登录凭据 */
export const session$ = {
  id: null,
  username: '',
  rolename: '',
  value: '',
};
/* 是否管理员 */
export const isAdmin$ = () => session$.value === 'superAdmin';

const addPer = (roleName) => {
  userPermission.forEach((item) => {
    if (item.name === roleName) {
      Object.assign(session$, {
        id: item.id,
        value: item.value,
        permissions: item.permissions,
      });
    }
  });
};

/* 挂载 DOM 前调用本函数 */
export const syncSession$ = () => getCurrentuser().then((res) => {
  const data = res.data.data;
  session$.newpermissions = data.permission;
  Object.assign(session$, {
    username: data.username,
    rolename: data.role_name,
    roleid: getRoleId(data.role_name),
    ts: data.ts,
  });
  addPer(data.role_name);
}).catch(() => {
  goToSSO(); // 跳转到单点登录
  throw new Error('Redirecting to SSO'); // 继续抛出，避免之后的 then 执行挂载 DOM
});

export const bmsAuth = {
  data() {
    return {
      session$,
      // timer: null,
    };
  },
  computed: {
    isAdmin$,
  },
};
