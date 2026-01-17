// Node fetch removed to use native http module

// If node version is new enough (v18+), fetch is global. If not, I'll use http module or assume fetch exists.
// To be safe, I'll use standard http module to avoid dependency issues.

const http = require('http');

const examData = {
    name: "Maths",
    questions: [
        {
            questionText: "What is 5 + 7?",
            options: ["10", "12", "13", "15"],
            correctAnswer: 1
        },
        {
            questionText: "What is 8 x 6?",
            options: ["42", "48", "56", "64"],
            correctAnswer: 1
        },
        {
            questionText: "Solve for x: 2x - 4 = 10",
            options: ["5", "6", "7", "8"],
            correctAnswer: 2
        },
        {
            questionText: "What is the square root of 144?",
            options: ["10", "11", "12", "14"],
            correctAnswer: 2
        },
        {
            questionText: "What is 20% of 150?",
            options: ["20", "25", "30", "35"],
            correctAnswer: 2
        },
        {
            questionText: "Which is a prime number?",
            options: ["9", "15", "21", "23"],
            correctAnswer: 3
        },
        {
            questionText: "What is the value of pi (approx)?",
            options: ["3.12", "3.14", "3.16", "3.18"],
            correctAnswer: 1
        },
        {
            questionText: "100 divided by 4 is?",
            options: ["20", "25", "30", "40"],
            correctAnswer: 1
        },
        {
            questionText: "What comes next: 2, 4, 8, 16, ...?",
            options: ["24", "30", "32", "64"],
            correctAnswer: 2
        },
        {
            questionText: "15 - 3 x 2 = ?",
            options: ["9", "24", "6", "12"],
            correctAnswer: 0
        }
    ]
};

const data = JSON.stringify(examData);

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/exams',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
            console.log('SUCCESS: Maths Exam Created!');
            console.log(responseData);
        } else {
            console.error(`FAILED: Status ${res.statusCode}`);
            console.error(responseData);
        }
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();
