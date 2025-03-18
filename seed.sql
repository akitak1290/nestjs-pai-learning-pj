CREATE TABLE Student (
    email VARCHAR(255) PRIMARY KEY,
    suspended BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Teacher (
    email VARCHAR(255) PRIMARY KEY,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE TeacherStudent (
    teacherEmail VARCHAR(255),
    studentEmail VARCHAR(255),
    PRIMARY KEY (teacherEmail, studentEmail),
    FOREIGN KEY (teacherEmail) REFERENCES Teacher(email) ON DELETE CASCADE,
    FOREIGN KEY (studentEmail) REFERENCES Student(email) ON DELETE CASCADE
);

INSERT INTO Student (email, suspended) VALUES 
    ('studentjack@gmail.com', false),
    ('studentbrandon@gmail.com', false),
    ('studentalex@gmail.com', false),
    ('studenttravis@gmail.com', false),
    ('studentmay@gmail.com', false),
    ('studentirene@gmail.com', false),
    ('studentchloe@gmail.com', false),
    ('studentjenny@gmail.com', false),
    ('studentlisa@gmail.com', false),
    ('studentrose@gmail.com', false),
    ('studentjohn@gmail.com', false),
    ('studentkevin@gmail.com', false),
    ('studentisaac@gmail.com', false),
    ('studentstanley@gmail.com', false),
    ('studentpeter@gmail.com', false);

INSERT INTO Teacher (email) VALUES 
    ('teacherken@gmail.com'),
    ('teacherjoe@gmail.com'),
    ('teacherkein@gmail.com'),
    ('teacherzoe@gmail.com'),
    ('teacherash@gmail.com');

INSERT INTO TeacherStudent (teacherEmail, studentEmail) VALUES 
    ('teacherken@gmail.com', 'studentjack@gmail.com'),
    ('teacherken@gmail.com', 'studentbrandon@gmail.com'),
    ('teacherjoe@gmail.com', 'studentalex@gmail.com'),
    ('teacherjoe@gmail.com', 'studenttravis@gmail.com'),
    ('teacherkein@gmail.com', 'studentmay@gmail.com'),
    ('teacherkein@gmail.com', 'studentirene@gmail.com'),
    ('teacherzoe@gmail.com', 'studentchloe@gmail.com'),
    ('teacherzoe@gmail.com', 'studentjenny@gmail.com'),
    ('teacherash@gmail.com', 'studentlisa@gmail.com'),
    ('teacherash@gmail.com', 'studentrose@gmail.com');
