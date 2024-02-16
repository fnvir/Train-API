import User from "../models/user.js";

export const getWallet = async (req, res) => {
    try {
        const { wallet_id } = req.params;
        const user = await User.findOne({ user_id: wallet_id });
        if (!user)
            return res.status(404).json({ message: `wallet with id: ${wallet_id} was not found` })
        res.status(200).json({ wallet_id:user.user_id, balance: user.balance, wallet_user: { user_id: user.user_id, user_name: user.user_name } })
    } catch (err) {
        console.error('Err at wallet/getWallet')
        res.status(500).json({ message: err.message })
    }
}

export const putBalance = async (req, res) => {
    try {
        const { recharge } = req.body;
        const { wallet_id } = req.params;
        let user = await User.findOne({ user_id: wallet_id });
        if (!user)
            return res.status(404).json({ message: `wallet with id: ${wallet_id} was not found` })
        if (recharge < 100 || recharge > 10000)
            return res.status(400).json({ message: `invalid amount: ${recharge}` })
        user.balance += recharge;
        user = await user.save()
        res.status(200).json({ wallet_id:user.user_id, balance: user.balance, wallet_user: { user_id: user.user_id, user_name: user.user_name } })
    } catch (err) {
        console.error('Err at wallet/putBalance')
        res.status(500).json({ message: err.message })
    }
}