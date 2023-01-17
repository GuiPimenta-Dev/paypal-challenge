# Endpoints

### Create User

    curl --request POST \
    --url http://localhost:3000/users \
    --header 'Content-Type: application/json' \
    --data '{
        "name": "JohnDoe",
        "password": "123456",
        "email": "john_doe@gmail.com",
        "cpf": "12345678910"
    }'

### Deposit Money

    curl --request POST \
    --url http://localhost:3000/transactions/deposit \
    --header 'Content-Type: application/json' \
    --data '{
        "payeeId": "${userId}",
        "value": 1000
    }'

### Transfer Money

    curl --request POST \
    --url http://localhost:3000/transactions/transfer \
    --header 'Content-Type: application/json' \
    --data '{
        "payerId": "${userId}",
        "payeeId": "${userId}",
        "value": 10
    }'

### Undo a transaction

    curl --request DELETE \
    --url http://localhost:3000/transactions/${transactionId} \
    --header 'Content-Type: application/json'

### List all transactions from a user

    curl --request GET \
    --url http://localhost:3000/transactions/${userId}

# Executing the server

    $ docker build . -t server
    $ docker run -p 3000:3000 server
