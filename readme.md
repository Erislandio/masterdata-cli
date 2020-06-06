# V2 Masterdata CLI V2 ![CLI](https://cdn4.iconfinder.com/data/icons/small-n-flat/24/terminal-64.png)


## Description:

Welcome to the masterdata cli, this CLI is only for querying data in the VTEX masterdata, it is not possible to change data and information.

## Install

```SH
yarn global add @erislandio/masterdata or npm install @erislandio/masterdata -g
```

## Usage: masterdata command [options]


### Options:


```SH

 version (v)   Output the version number                                                            
  create        Create a new account: masterdata create {accountName}                                      
  list (ls)     List all registered accounts: masterdata ls                                          
  login (l)     Sign in to an account, example: masterdata login teste@gmail.com or masterdata login 
  switch (s)    Switch account: masterdata switch [teste]                                            
  whoami (w)    displays the information of the logged in user                                       
  help (h)      shows this list of options

```
  
  

### starting

  
* if you are already registered


```sh
masterdata login [email]
```

* if you don't have one, just create

```sh
masterdata new [email]
```

* Adding an account to make queries. You will need `appKey` and `appToken` (rest assured it will not be public)

```sh
masterdata create [accountName]
```

## prints

- login

![cli](https://res.cloudinary.com/acct/image/upload/v1591411741/msaterdata%20cli/login_zb1sab.png)

- whoami

![cli](https://res.cloudinary.com/acct/image/upload/v1591411741/msaterdata%20cli/whoami_bq7lrz.png)