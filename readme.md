# masterdata V2 Masterdata CLI ![CLI](https://cdn4.iconfinder.com/data/icons/small-n-flat/24/terminal-64.png)

![enter image description here](https://image.flaticon.com/icons/svg/2534/2534297.svg)

## Install

```SH
yarn global add @erislandio/masterdata or npm install @erislandio/masterdata -g
```

## Usage: masterdata [options]

  

### Options:

  

```sh
-V, --version output the version number

-lg, --login Login on application

-u, --use Use an account

-i, --info Show account info

-a, --add Add an account

--logout Logout

-ls, --list Lists created accounts

-rm, --remove Remove an account

-dbs, --databases List databases (acronym)

--all <acronym> Get all data from acronym

-q, --query <query> Get all data from acronym - ex: select firstName from CL

-d, --desc <acronym> List info from table ex: --desc 'CL'

-n, --new Create new user

--banner Show banner

-h, --help display help  for  command
```

  
  

### starting

  
* if you are already registered

  

```sh
masterdata --login
```

* if you don't have one, just create

  

```sh
masterdata --new
```

  

* Adding an account to make queries. You will need `appKey` and `appToken` (rest assured it will not be public)

  

```sh
masterdata --add
```

  

### Query example:

* all databases

```SH
    masterdata --dbs
```

* select

```sh
    masterdata -q "select * from CL where email='user@email.com'"
```

* select filter

```sh
    masterdata -q "select firstName, lastName from CL where email='user@email.com'"
```

* desc

```sh
    masterdata --desc CL
```

### Exit

```sh
    masterdata --logout
```