const jwt = require('jsonwebtoken');

module.exports = {
    inputs: {
        token: {
            type: 'string',
            required: true,
        },
    },
    exits: {
        success: {
            description: 'User logged in successfully.',
            responseType: 'ok',
        },
        invalidToken: {
            description: 'Invalid Google token.',
            responseType: 'badRequest',
        },
    },

    fn: async function (inputs, exits) {
        
        const googleResponse = await fetch(
            `https://www.googleapis.com/oauth2/v3/userinfo`, 
            { headers: { Authorization: `Bearer ${inputs.token}` } }
        );
        const googleData = await googleResponse.json();


        const { email, name} = googleData;
        
        if (!email) {
            return exits.badRequest({ message: 'Không lấy được thông tin email từ Google.' });
        }
        let user = await User.findOne({ email });

        if(!user) {
            let baseUsername = email.split('@')[0];
            let username = baseUsername;
            let counter = 1;

            let existingUser = await User.findOne({ username });
            while (existingUser) {
                username = `${baseUsername}${counter}`;
                counter++;
                existingUser = await User.findOne({ username });
            }

            // tạo ng dùng mới với username là username và password là random
            const password = Math.random().toString(36).slice(-8); // random password

            let role = 'user'; 
            if (email === process.env.ADMIN_EMAIL) {
                role = 'admin'; 
            }

            user = await User.create({
                username,
                email,
                password,
                role
            }).fetch();

            if (!user) {
                return exits.badRequest({ message: 'Đăng ký không thành công.' });
            }
            const jwtToken = jwt.sign(
                { username: user.username, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            return exits.success({ 
                user: { 
                    username: user.username, 
                    role: user.role 
                }, 
                token: jwtToken,
                message: 'Đăng ký thành công, đăng nhập tự động.' 
            });
        }
        else {
            const jwtToken = jwt.sign(
                { username: user.username, email: user.email, isAdmin: user.isAdmin, id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            return exits.success({ 
                user: { 
                    username: user.username, 
                    id: user.id,
                    isAdmin: user.isAdmin
                }, 
                token: jwtToken,
                message: 'Đăng nhập thành công.'
            });
        }
        


        

    },
}