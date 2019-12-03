export const dataService = {
    getUser,
    getResolvedTests,
    getResolvedExams,
    generateTest,
    generateExam,
    getAllTests,
    getAllExams,
    getUsersByRole,
    postResolvedTests
};

function getUser(userId) {
    return fetch(`/api/usr/${userId}`).then(res => {
        return res.json().then(re => {
            return re;
        })
    })
}

function getUsersByRole(userRole) {
    return fetch(`/api/usr/byRole/${userRole}`).then(res => {
        return res.json().then(re => {
            return re;
        })
    })
}

function getAllTests() {
    return fetch('/api/tests').then(res => {
        return res.json().then(re => {
            return re;
        })
    })
}

function getResolvedTests() {
    return fetch('/api/resolvedTests').then(res => {
        return res.json().then(re => {
            return re;
        })
    })
}

function postResolvedTests(id, subject, userId, points) {
    return fetch('/api/resolvedTests', {
        method: 'POST',
        body: JSON.stringify({
            testId: id,
            subject: subject,
            userId: userId,
            points: points
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        return res.json().then(re => {
            return re;
        })
    })
}

function getAllExams() {
    return fetch('/api/exams').then(res => {
        return res.json().then(re => {
            return re;
        })
    })
}

function getResolvedExams() {
    return fetch('/api/resolvedExams').then(res => {
        return res.json().then(re => {
            return re;
        })
    })
}

function generateExam(size, subject, name) {
    return fetch('/api/questions/generateExam', {
        method: 'POST',
        body: JSON.stringify({
            size: size,
            subject: subject,
            name: name
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        return res.json().then(re => {
            return re;
        })
    })
}

function generateTest(size, subject, name) {
    return fetch('/api/questions/generateTest', {
        method: 'POST',
        body: JSON.stringify({
            size: size,
            subject: subject,
            name: name
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        return res.json().then(re => {
            return re;
        })
    })
}
