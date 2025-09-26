import supabase from "../supabase.js";

async function users(callback, callbackWithCache) {
    try {
        users.isSigned = true;
        if (!users.cache) {
            const userDataCache = localStorage.getItem('users');
            if (!userDataCache) {
                users.isSigned = false;
                throw 'Chưa đăng nhập tài khoản';
            }
            users.cache = JSON.parse(userDataCache);
        }
        callbackWithCache(users.cache);
        if (!users.data) {
            if (!users.isLoadingFromDatabase) {
                users.isLoadingFromDatabase = true;
                users.loadUserDataCallback.push(callback);
                await getUserDataFromDatabase();
                for (const call of users.loadUserDataCallback) {
                    call(users.data);
                }
                console.log(users.data);
                //Unused when finish await 
                delete users.isLoadingFromDatabase;
                delete users.loadUserDataCallback;
            } else {
                users.loadUserDataCallback.push(callback);
            }
        } else {
            callback(users.data);
        }
    }
    catch (e) {
        callback();
        console.log(e);
    }
}

async function getUserDataFromDatabase() {
    const [
        { data: { session }, error: getSessionError },
        { data: { user }, error: userError },
        { data: { userData: information }, error: getInformationError },
        { data: { userData: privateInformation }, error: getPrivateInformationError }
    ] = await Promise.all([
        supabase.auth.getSession(),
        supabase.auth.getUser(),
        supabase.functions.invoke('getUserInformation', {
            body: { userId: users.cache.id }
        }),
        supabase.functions.invoke('getPrivateData', {
            body: {},
        })
    ]);
    if (getSessionError || userError || getInformationError || getPrivateInformationError) {
        users.isSigned = false;
        throw `Đã có lỗi xảy ra ${getSessionError} ${userError} ${getInformationError} ${getPrivateInformationError}`;
    }
    users.data = {
        ...information,
        email: user.email,
        session: session.access_token,
        private: privateInformation
    };
    if (JSON.stringify(users.data) !== JSON.stringify(users.cache)) {
        localStorage.setItem('users', JSON.stringify(users.data));
    }
}

users.isSigned = false;
users.isLoadingFromDatabase = false;
users.loadUserDataCallback = [];

export default users;