import {Request, Response} from 'express';

import { getRepository } from 'typeorm';

import orphanagesView from '../views/orphanages_view';

import Orphanage from '../models/Orphanage';

export default {
  async index(request: Request, response: Response){

    const orphanagesRepository = getRepository(Orphanage);

    const orphanages = await orphanagesRepository.find({
      relations: ['images']
    });

    return response.json(orphanagesView.renderMany(orphanages));

  },

  async show(request: Request, response: Response){

    const { id } = request.params;

    const orphanagesRepository = getRepository(Orphanage);

    const orphanage = await orphanagesRepository.findOneOrFail(id, {
      relations: ['images']
    });

    return response.json(orphanagesView.render(orphanage));

  },

  async create(request: Response, response: Request){

    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
    } = request.body;  //check 1:07:41
  
    const orphanagesRepository = getRepository(Orphanage);

    const requestImages = request.files as Express.Multer.File[];
    
    const images = requestImages.map(image => {
      return { path: image.filename}
    })
    const orphanage = orphanagesRepository.create({
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      images
    });
  
    await orphanagesRepository.save(orphanage);
  
    return response.status(201).json(orphanage);
  }

}