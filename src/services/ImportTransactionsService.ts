import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';

interface RequestDTO {
  title: string;
  value: number;
  type: 'outcome' | 'income';
  category: string;
}

class ImportTransactionsService {
  async execute({ filename }: Express.Multer.File): Promise<Transaction[]> {
    const csvFilePath = path.resolve(uploadConfig.directory, `${filename}`);

    const readCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const createTransactionService = new CreateTransactionService();

    const transactionsObject: RequestDTO[] = [];

    parseCSV.on('data', async ([title, type, value, category]) => {
      const transactionObject: RequestDTO = {
        title,
        type,
        value,
        category,
      };

      transactionsObject.push(transactionObject);
    });

    await new Promise((resolve, reject) => {
      parseCSV.on('error', err => reject(err));
      parseCSV.on('end', resolve);
    });

    const transactions: Transaction[] = [];

    for (const transaction of transactionsObject) {
      const newTransaction = await createTransactionService.execute(
        transaction,
      );

      transactions.push(newTransaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
