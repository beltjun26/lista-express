// import { createAvatar } from '@dicebear/avatars';
// import * as style from '@dicebear/adventurer';
import { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { AppDataSource } from '../data-source';
import { Bot } from '../entity/Bot';

export const botRouter = Router();

botRouter.post(
  "/",
  // To do extract validators for cleaner code and make it DRY
  body('name').exists(),
  body('purpose').exists(),
  async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newBot = new Bot();
    newBot.name = req.body.name;
    newBot.purpose = req.body.purpose;
    
    // Handle avatars
    // let svg = createAvatar(style, {
    //   seed: 'custom-seed',
    //   // ... and other options
    // });
    
    const botRepository = AppDataSource.getRepository(Bot);
    const savedBot = await botRepository.save(newBot);

    return res.status(200).send(savedBot);
  }
)

botRouter.get(
  "/",
  async (req: Request, res: Response): Promise<Response> => {
    const botRepository = AppDataSource.getRepository(Bot);

    const bots = await botRepository.find();

    return res.status(200).send({
      bots: bots,
    })

  }
)

botRouter.delete(
  "/:id",
  param('id').exists(),
  async (req: Request, res: Response): Promise<Response> => {
    const botRepository = AppDataSource.getRepository(Bot);

    const toDeleteId = req.params.id;

    const numericNumber = Number(toDeleteId);
    
    const bot = await botRepository.findOneBy({
      id: numericNumber,
    });

    if (!bot) {
      return res.status(400).send(
        {
          value: numericNumber,
          msg: "Bot does not exist",
          param: "id",
          location: "params",
        }
      );
    }
    await botRepository.delete(numericNumber);

    return res.status(200).send({
      id: toDeleteId,
    });
  }
)

botRouter.get(
  "/:id",
  param('id').isNumeric(),
  async (req: Request, res: Response): Promise<Response> => {
    const botRepository = AppDataSource.getRepository(Bot);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const numericNumber = Number(req.params.id);
    
    const bot = await botRepository.findOneBy({
      id: numericNumber,
    });

    if (!bot) {
      return res.status(400).send(
        {
          value: numericNumber,
          msg: "Bot does not exist",
          param: "id",
          location: "params",
        }
      );
    }

    return res.status(200).send(bot);

  }
)

botRouter.put(
  "/:id",
  param('id').isNumeric(),
  async (req: Request, res: Response): Promise<Response> => {
    const botRepository = AppDataSource.getRepository(Bot);
    
    const numericNumber = Number(req.params.id);
    
    const bot = await botRepository.findOneBy({
      id: numericNumber,
    });

    if (!bot) {
      return res.status(400).send(
        {
          value: numericNumber,
          msg: "Bot does not exist",
          param: "id",
          location: "params",
        }
      );
    }

    bot.name = req.body.name || bot.name;
    bot.purpose = req.body.purpose || bot.purpose;

    botRepository.save(bot);
    return res.status(200).send(bot);

});