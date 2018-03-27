// 是否登录
const requiredLogin = (req, res, next) => {
    const _user = req.session.user;
    if (!_user) {
        console.log(Date.now(),'_user不存在');
        res.locals.auth = {
            admin: false,
            message: '没有账户'
        };

    }
    next()
};
// 是否有权限
const requiredAdmin = (req, res, next) => {
    const _user = req.session.user;
    console.log(_user.role);
    if (_user.role < 10 || _user.role === undefined) {
        console.log("没有权限");
        res.locals.auth = {
            admin: false,
            message: '没有权限'
        };
    }
    next();
};


module.exports = {requiredLogin, requiredAdmin};
