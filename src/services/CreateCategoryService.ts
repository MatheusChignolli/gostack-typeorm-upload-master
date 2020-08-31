import { getCustomRepository } from 'typeorm';

import Category from '../models/Category';
import CategoriesRepository from '../repositories/CategoriesRepository';

class CreateCategoryService {
  public async execute(categoryTitle: string): Promise<Category> {
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const categoryExists = await categoriesRepository.categoryExists(
      categoryTitle,
    );

    if (categoryExists) {
      return categoryExists;
    }

    const newCategory = categoriesRepository.create({
      title: categoryTitle,
    });

    const category = await categoriesRepository.save(newCategory);

    return category;
  }
}

export default CreateCategoryService;
