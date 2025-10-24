## Kelp_Assignment_Erica Prasad

This project provides a working solution to the Kelp Assignment. 
It is a Node.js command-line script built to demonstrate custom CSV parsing, efficient data processing, and PostgreSQL database interaction.

## Key Features
1. Custom CSV Parser: Uses custom logic (no external NPM CSV packages) to handle dot-separated properties of "infinite depth."
2. Data Mapping: Separates mandatory fields (`name`, `age`) from complex fields (`address`) and groups remaining properties into the `additional_info` JSONB column.
3. Bulk Insertion:Uses concurrent database queries for efficient insertion.

## Assumptions
1. CSV Format: Assumes fields are consistently separated by commas (`,`) and do not contain escaped commas within the field values.
2. Performance: Uses synchronous file reading (`fs.readFileSync`), which is acceptable for single-run processing.

## Requirements
1. Node.js 
2. PostgreSQL Server (running on port 5432)
3. data/input.csv (file containing the records to process)


## Running the Application
1. Setup PostgreSQL: Ensure the local PostgreSQL server is running and the database  with the `users` table has been created.
2.  Dependencies: Run `npm install` in the project root.
3.  Configuration: Update the `.env` file with the correct database credentials.
4.  Input Data: Place the CSV file, named `input.csv`, inside the `/data` folder.
5.  Execute: Run the script using the command:
    
    ```bash
    node src/index.js
    ```
