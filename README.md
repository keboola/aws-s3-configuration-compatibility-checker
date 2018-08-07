# keboola.ex-aws-s3 Configuration Compatibility Checker

## Installation

```
docker-compose build
docker-compose run node yarn install
```

## Download Adapters

```
wget https://raw.githubusercontent.com/keboola/kbc-ui/master/src/scripts/modules/ex-aws-s3/adapters/row.js -O ./adapters/src/original.js
wget https://raw.githubusercontent.com/keboola/kbc-ui/najlos-s3-extractor-1/src/scripts/modules/ex-aws-s3/adapters/conform.js -O ./adapters/src/conform.js
wget https://raw.githubusercontent.com/keboola/kbc-ui/najlos-s3-extractor-1/src/scripts/modules/ex-aws-s3/adapters/row.js -O ./adapters/src/new.js
```

## Compile Adapters

```
docker-compose run node yarn run compile
```

## Download data files

```
docker run --volume=$("pwd")/data:/data quay.io/keboola/storage-api-cli --token=*** export-table out.c-aws-s3-configuration-migration-check.eu /data/eu.csv
docker run --volume=$("pwd")/data:/data quay.io/keboola/storage-api-cli --token=*** export-table out.c-aws-s3-configuration-migration-check.us /data/us.csv
```


## Usage

```
docker-compose run node sh -c "yarn compare --data=./data/eu.csv"
docker-compose run node sh -c "yarn compare --data=./data/eu.csv"
```
