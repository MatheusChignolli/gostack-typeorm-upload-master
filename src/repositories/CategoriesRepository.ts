import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async categoryExists(
    categoryTitle: string,
  ): Promise<Category | undefined> {
    const category = await this.findOne({
      where: { title: categoryTitle },
    });

    return category;
  }
}

export default CategoriesRepository;
