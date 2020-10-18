import {Request, Response} from 'express';
import { getRepository } from 'typeorm';
import orphanagesView from '../views/orphanages_view';
import Orphanage from '../models/Orphanage';

import * as Yup from 'yup';

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

    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends: open_on_weekends === 'true', // check aula 3, 1:40:00
      images
    };

    const schema = Yup.object().shape({
      name: Yup.string().required('Nome obrigatório'),
      latitude: Yup.number().required('Latitude obrigatória'),
      longitude: Yup.number().required('Longitude obrigatória'),
      about: Yup.string().required('Sobre obrigatório').max(300),
      instructions: Yup.string().required('Instruções obrigatórias'),
      opening_hours: Yup.string().required('Horário de funcionamento obrigatório'),
      open_on_weekends: Yup.boolean().required('Informar se abre aos fins de semana obrigatório'),
      images: Yup.array(Yup.object().shape({
        path: Yup.string().required()
      }))
    })

    await schema.validate(data, {
      abortEarly: false,
    });

    const orphanage = orphanagesRepository.create(data);

    await orphanagesRepository.save(orphanage);
  
    return response.status(201).json(orphanage);
  }

}