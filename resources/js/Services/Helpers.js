const getAvatarUrl = (data) => {
    if (!data.avatar_path) {
        return `https://ui-avatars.com/api/?name=${data.first_name}&color=7F9CF5&background=EBF4FF`;
    }

    return data.avatar_path_url;
}

export {
    getAvatarUrl
}
