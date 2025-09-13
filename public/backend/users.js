import supabase from "../supabase.js";

async function users(callback) {
    const { data: {session} } = await supabase.auth.getSession();
    if (!session) {
        users.isSigned = false;
        callback();
        return;
    }
    users.isSigned = true;
    const {data, error} = await supabase.functions.invoke('getUserInformation',{
        body: {}
    });
    if (error) {
        users.isSigned = false;
        callback();
        return;
    }
    callback();
}

users.isSigned = false;

export default users;