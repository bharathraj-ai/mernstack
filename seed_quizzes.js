const http = require('http');

const mathsExam = {
    name: "Mathematics Quiz",
    questions: [
        {
            questionText: "What is 15 × 12?",
            options: ["160", "170", "180", "190"],
            correctAnswer: 2
        },
        {
            questionText: "Solve: 3x + 9 = 24. What is x?",
            options: ["3", "4", "5", "6"],
            correctAnswer: 2
        },
        {
            questionText: "What is the area of a circle with radius 7? (Use π = 22/7)",
            options: ["144 sq units", "154 sq units", "164 sq units", "174 sq units"],
            correctAnswer: 1
        },
        {
            questionText: "What is the HCF of 36 and 48?",
            options: ["6", "8", "12", "18"],
            correctAnswer: 2
        },
        {
            questionText: "If a triangle has angles 60° and 80°, what is the third angle?",
            options: ["30°", "40°", "50°", "60°"],
            correctAnswer: 1
        },
        {
            questionText: "What is 2⁵ (2 to the power 5)?",
            options: ["16", "25", "32", "64"],
            correctAnswer: 2
        },
        {
            questionText: "The sum of first 10 natural numbers is?",
            options: ["45", "50", "55", "60"],
            correctAnswer: 2
        },
        {
            questionText: "What is 0.75 expressed as a fraction?",
            options: ["1/2", "2/3", "3/4", "4/5"],
            correctAnswer: 2
        },
        {
            questionText: "A shopkeeper gives 20% discount on ₹500. What is the selling price?",
            options: ["₹350", "₹380", "₹400", "₹420"],
            correctAnswer: 2
        },
        {
            questionText: "What is the LCM of 4, 6 and 8?",
            options: ["12", "16", "24", "48"],
            correctAnswer: 2
        }
    ]
};

const programmingExam = {
    name: "Programming Quiz",
    questions: [
        {
            questionText: "Which keyword is used to declare a variable in JavaScript (ES6)?",
            options: ["var", "let", "int", "dim"],
            correctAnswer: 1
        },
        {
            questionText: "What does HTML stand for?",
            options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"],
            correctAnswer: 0
        },
        {
            questionText: "Which data structure uses FIFO (First In First Out)?",
            options: ["Stack", "Queue", "Tree", "Graph"],
            correctAnswer: 1
        },
        {
            questionText: "What is the output of: print(type(10)) in Python?",
            options: ["<class 'float'>", "<class 'str'>", "<class 'int'>", "<class 'num'>"],
            correctAnswer: 2
        },
        {
            questionText: "Which of these is NOT a programming language?",
            options: ["Python", "Java", "HTML", "C++"],
            correctAnswer: 2
        },
        {
            questionText: "What does CSS stand for?",
            options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Colorful Style Sheets"],
            correctAnswer: 1
        },
        {
            questionText: "Which symbol is used for single-line comments in JavaScript?",
            options: ["#", "//", "/* */", "--"],
            correctAnswer: 1
        },
        {
            questionText: "What is the time complexity of binary search?",
            options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
            correctAnswer: 2
        },
        {
            questionText: "In Python, which keyword is used to define a function?",
            options: ["func", "function", "def", "define"],
            correctAnswer: 2
        },
        {
            questionText: "What does API stand for?",
            options: ["Application Programming Interface", "Applied Program Integration", "Advanced Protocol Interface", "Application Process Integration"],
            correctAnswer: 0
        }
    ]
};

function sendExam(examData) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(examData);

        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/exams',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => { responseData += chunk; });
            res.on('end', () => {
                if (res.statusCode === 200 || res.statusCode === 201) {
                    console.log(`✅ "${examData.name}" created successfully! (${examData.questions.length} questions)`);
                    resolve(responseData);
                } else {
                    console.error(`❌ Failed to create "${examData.name}": Status ${res.statusCode}`);
                    console.error(responseData);
                    reject(responseData);
                }
            });
        });

        req.on('error', (error) => {
            console.error(`❌ Error creating "${examData.name}":`, error.message);
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

async function seedAll() {
    console.log('🚀 Seeding quizzes...\n');

    await sendExam(mathsExam);
    await sendExam(programmingExam);

    console.log('\n🎉 All quizzes seeded successfully!');
}

seedAll();
