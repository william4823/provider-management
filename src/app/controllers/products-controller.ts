import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Products from '../models/Products';
import Providers from '../models/Providers';
import Group from '../models/Group';

export default class Product {
  async create(req: Request, res: Response) {
    const {
      name, price, productCode, provider, group,
    } = req.body;

    const ProductsRepository = getRepository(Products);
    const ProviderRepository = getRepository(Providers);
    const GroupRepository = getRepository(Group);

    const providerID = await ProviderRepository.findOne({ name: provider });
    const groupID = await GroupRepository.findOne({ name: group });

    if (!providerID || !groupID) {
      return res.status(400).json('Check if providers or group exist');
    }

    const thereIs = await ProductsRepository.find({ name });

    if (thereIs.length !== 0) {
      return res.status(400).json({ error: `The product ${name} was already created!` });
    }

    const data = {
      name,
      price,
      productCode,
      provider: providerID,
      group: groupID,
    };

    const products = ProductsRepository.create(data);

    await ProductsRepository.save(products);

    return res.status(200).json(products);
  }
}