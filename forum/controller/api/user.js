module.exports = {
  async login(ctx, next) {
    let account = ctx.request.body.account;
    let password = ctx.request.body.password;
    let res = await UserService.login(account, password);
    if (res.res) {
      ctx.cookies.set('access_token', res.token, {
        maxAge: 1000 * 60 * 60 * 1,
        expires: new Date('2019-07-06'),
        httpOnly: false,
        overwrite: false
      });
      ctx.success(200, { id: res.data.id, name: res.data.name, token: res.token });
    } else {
      ctx.error(500, res.errMsg);
    }
  },

  async register(ctx, next) {
    let account = ctx.request.body.account;
    let password = ctx.request.body.password;
    let confirmPassword = ctx.request.body.confirmPassword;
    let avator = ctx.request.body.avator;
    let name = ctx.request.body.name;
    let sex = parseInt(ctx.request.body.sex)
    let res = await UserService.registerUser(account, password, confirmPassword, avator, name, sex);
    if (res.res) {
      ctx.success(200, { id: res.data.id });
    } else {
      ctx.error(500, res.errMsg);
    }
  },
  // 查看个人信息
  async detail(ctx) {
    let userId = ctx.state.payload && ctx.state.payload.userId;
    let seeUserId = parseInt(ctx.params.id);
    let res = await UserService.getDetail(userId, seeUserId);
    if (res.res) {
      ctx.success(200, res.data);
    } else {
      ctx.error(500, res.errMsg);
    }
  },
  async update(ctx) {
    let action = ctx.request.body.action;
    let userId = parseInt(ctx.params.id);
    if (ctx.state.payload.userId !== userId) return ctx.forbidden();
    if (action === 'UPDATE_PASSWORD') {
      let oldP = ctx.request.body.oldPassword;
      let newP = ctx.request.body.newPassword;
      let secP = ctx.request.body.secPassword;
      let res = await UserService.changePassword(userId, oldP, newP, secP);
      if (res.res) {
        ctx.success(200, { id: res.data.id });
      } else {
        ctx.error(500, res.errMsg);
      }
      return;
    }
    if (action === 'UPDATE_INFO') {
      let name = ctx.request.body.name;
      let sex = parseInt(ctx.request.body.sex);
      let avator = ctx.request.body.avator;
      let res = await UserService.updateInfo(userId, { name, sex, avator });
      if (res.res) {
        ctx.success(200, { id: res.data.id, name: res.data.name });
      } else {
        ctx.error(500, res.errMsg);
      }
      return;
    }
    ctx.error(500, 'Invalid Action');
  },

  // 关注
  async follow(ctx) {
    let followUserId = parseInt(ctx.query.userId);  // 被关注id
    let fansUserId = ctx.state.payload && ctx.state.payload.userId;
    if (!fansUserId) return ctx.invalid('没有登录');
    let res = await UserService.follow(fansUserId, followUserId);
    if (res.res) {
      ctx.success(200, res.data);
    } else {
      ctx.error(500, res.errMsg);
    }
  },

  // 取消关注
  async unfollow(ctx) {
    let unfollowUserId = parseInt(ctx.query.userId);  // 被取消关注id
    let fansUserId = ctx.state.payload && ctx.state.payload.userId;
    if (!fansUserId) return ctx.invalid('没有登录');
    let res = await UserService.unfollow(fansUserId, unfollowUserId);
    if (res.res) {
      ctx.success(200, res.data);
    } else {
      ctx.error(500, res.errMsg);
    }
  },

  // 关注列表
  async getFollowList(ctx) {
    let userId = ctx.query.userId;
    res = await UserService.getFollowList(userId);
    if (res.res) {
      ctx.success(200, res.data);
    } else {
      ctx.error(500, res.errMsg);
    }
  },

  // 粉丝列表
  async getFansList(ctx) {
    let userId = ctx.query.userId;
    res = await UserService.getFansList(userId);
    if (res.res) {
      if (res.res) {
        ctx.success(200, res.data);
      } else {
        ctx.error(500, res.errMsg);
      }
    }
  }

}