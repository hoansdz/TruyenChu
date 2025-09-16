import supabase from "../supabase.js";

async function users(callback) {
    users.isSigned = true;
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            throw null;
        }
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
            throw null;
        }
        const { data: {userData}, error } = await supabase.functions.invoke('getUserInformation', {
            body: { userId: user.id }
        });
        if (error) {
            throw null;
        }
        users.data = userData;
        users.email = user.email;
        users.session = session.access_token;
        console.log(session);
        callback();
    }
    catch (e) {
        users.isSigned = false;
        callback();
        console.log(e ?? 'Khong loi');
    }
}

users.isSigned = false;

export default users;