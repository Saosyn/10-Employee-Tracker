INSERT INTO department (name)
VALUES
    ('IT'),
    ('Finance & Accounting'),
    ('Human Resources'),
    ('Marketing'),
    ('Customer Support');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Full Stack Developer', 80000, 1),
    ('Software Engineer', 100000, 1),
    ('DevOps Engineer', 95000, 1),
    ('Data Analyst', 75000, 2),
    ('Accountant', 70000, 2),
    ('HR Manager', 85000, 3),
    ('Recruiter', 60000, 3),
    ('Marketing Manager', 90000, 4),
    ('SEO Specialist', 65000, 4),
    ('Customer Support Representative', 50000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Smith', 1, NULL),
    ('Emma', 'Jones', 2, 1),
    ('Liam', 'Brown', 3, 1),
    ('Sophia', 'Davis', 4, NULL),
    ('Mason', 'Wilson', 5, 4),
    ('Olivia', 'Moore', 6, NULL),
    ('Noah', 'Taylor', 7, 6),
    ('Ava', 'Anderson', 8, NULL),
    ('Lucas', 'Thomas', 9, 8),
    ('Mia', 'White', 10, NULL),
    ('Ethan', 'Harris', 10, 10),
    ('Charlotte', 'Martin', 10, 10),
    ('James', 'Thompson', 10, 10),
    ('Amelia', 'Garcia', 10, 10),
    ('Benjamin', 'Martinez', 10, 10);