const users = [{
    id: 1,
    name: 'Andrew',
    schoolId: 101
}, {
    id: 2,
    name: 'Jessica',
    schoolId: 999
}];

const grades = [{
    id: 1,
    schoolId: 101,
    grade: 86
}, {
    id: 2,
    schoolId: 999,
    grade: 100
}, {
    id: 3,
    schoolId: 101,
    grade: 80
}];

const getUsers = (id) => {
    return new Promise((resolve, reject) => {
        const user = users.find((user) => {
            return user.id === id;
        });

        if(user) {
            resolve(user);
        } else {
            reject(`Unable to find user with id of ${id}.`);
        }
    });
};

const getGrades = (schoolId) => {
    return new Promise((resolve, reject) => {
        resolve(grades.filter((grade) => grade.schoolId === schoolId));
    })
};

// Andrew has a 83% in the class
const getStatus = (userId) => {
    return getUsers(userId).then((tempUser) => {
        user = tempUser;
        return getGrades(user.schoolId);
    }).then((grades) => {
        let average = 0;

        if(grades.length > 0) {
            average = grades.map((grade) => grade.grade).reduce((a, b) => {

                return a + b;
            });
            average /= grades.length;

            return `${user.name} has a ${average}% in the class.`
        }
    })
}

const getStatusAlt = async (userId) => {
    const user = await getUsers(userId);
    const grades = await getGrades(user.schoolId);
    let average = 0;

    if(grades.length > 0) {
        average = grades.map((grade) => grade.grade).reduce((a, b) => {
        return a + b;
        });
        average /= grades.length;
    }

    return `${user.name} has a ${average}% in the class.`
};

getStatusAlt(2).then((name) => {
    console.log(name);
}).catch((err) => {
    console.log(err);
});

// getStatus(1).then((status) => {
//     console.log(status);
// }).catch((err) => {
//     console.log(err);
// })