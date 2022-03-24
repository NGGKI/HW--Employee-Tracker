/* select all table */

USE employees_db;
select * from department;
select * from role;
select * from employee

/* join method */

USE employees_db;
SELECT department.name as 'department', role.title as 'Title', role.salary as 'Salary'
FROM role
LEFT JOIN employee
ON department.id = role.department_id


