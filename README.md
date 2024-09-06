


** Packages Used
1. cli-color: helps to colsole log in different color
2. mongoose: used to do database operations



# Model
all the function that interact with the database
# Utils
no function interact with the database, but are used by the cotrollers or other


loop-connect.versel.com blogging assignment

# Cron Job: 
we never delete data from the database, but marked it as deleted to remove from client perspective
1. add the flag in blogs: dafault: false
2. in delete api, update the flag:; true, time (deletion time)
3. Remove the deleted blogs from read api
4. Cron Schedular: cron.schedule("* * * * * *", ()=>{functiontorun()})
* : 0,1 or sun,mon or sunday, monday
* : sun-wed
* represent everyday


nodemailler
never use the personal email for mail
1. transporter: gmail, yahoo, rediff, auth {mail and password}
2. mail option: from, to, sub, text
two step auth should be off or a temperory password can be used

465 is the secure port
nodemailer.com and w3school
