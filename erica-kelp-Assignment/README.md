
This project solves the Kelp Assignment by implementing a custom Node.js script to read a CSV file. And convert it to a nested JSON structure, map the data to the required PostgreSQL schema, and calculate the Age Distribution Report.

## Key Features
1. Custom CSV Parser: Uses custom logic (no external NPM CSV packages) to handle dot-separated properties of "infinite depth."
2. Data Mapping: Separates mandatory fields (`name`, `age`) from complex fields (`address`) and groups remaining properties into the `additional_info` JSONB column.
3. Bulk Insertion:Uses concurrent database queries for efficient insertion.

## Assumptions
1. CSV Format: Assumes fields are consistently separated by commas (`,`) and do not contain escaped commas within the field values.
2. Performance: Uses synchronous file reading (`fs.readFileSync`), which is acceptable for single-run processing.

## How to Run Locally

1. Setup PostgreSQL: Ensure the local PostgreSQL server is running and the database  with the `users`table has been created (using the provided DDL).
2.  Dependencies: Run `npm install` in the project root.
3.  Configuration: Update the `.env` file with the correct database credentials.
4.  Input Data: Place the CSV file, named `input.csv`, inside the `/data` folder.
5.  Execute: Run the script using the command:
    
    ```bash
    node src/index.js
    ```