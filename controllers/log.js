import user from '../api/log'

export default {
    logon: async (req, res) => {
        user.logon(req.body.name, req.body.password, req.body.email)
            .then(msg => {
                return res.json({
                    success: true,
                    message: msg,
                })
            })
            .catch(msg => {
                return res.json({
                    success: false,
                    message: msg,
                })
            })
    },
    login: async (req, res) => {
        user.login(req)
            .then(msg => {
                return res.json({
                    success: true,
                    message: msg,
                })
            })
            .catch(msg => {
                return res.json({
                    success: false,
                    message: msg,
                })
            })
    },
}