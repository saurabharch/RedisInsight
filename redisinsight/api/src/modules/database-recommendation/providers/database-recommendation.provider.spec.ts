import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';
import {
  mockClientMetadata,
  mockQueryBuilderGetMany,
  mockRepository,
  mockDatabase,
  MockType,
} from 'src/__mocks__';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DatabaseRecommendationProvider }
  from 'src/modules/database-recommendation/providers/database-recommendation.provider';
import { DatabaseRecommendationEntity }
  from 'src/modules/database-recommendation/entities/database-recommendation.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Vote } from 'src/modules/database-recommendation/models';

const mockDatabaseRecommendationEntity = new DatabaseRecommendationEntity({
  id: uuidv4(),
  databaseId: mockDatabase.id,
  name: 'luaScript',
  createdAt: new Date(),
  read: false,
  disabled: false,
  vote: null,
});

const mockDatabaseRecommendation = {
  id: mockDatabaseRecommendationEntity.id,
  createdAt: mockDatabaseRecommendationEntity.createdAt,
  databaseId: mockDatabaseRecommendationEntity.databaseId,
  read: mockDatabaseRecommendationEntity.read,
  name: mockDatabaseRecommendationEntity.name,
  disabled: mockDatabaseRecommendationEntity.disabled,
  vote: mockDatabaseRecommendationEntity.vote,
};

const mockDatabaseRecommendationVoted = {
  ...mockDatabaseRecommendationEntity,
  vote: Vote.Like,
};

describe('DatabaseRecommendationProvider', () => {
  let service: DatabaseRecommendationProvider;
  let repository: MockType<Repository<DatabaseRecommendationEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseRecommendationProvider,
        EventEmitter2,
        {
          provide: getRepositoryToken(DatabaseRecommendationEntity),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DatabaseRecommendationProvider>(DatabaseRecommendationProvider);
    repository = module.get(getRepositoryToken(DatabaseRecommendationEntity));
  });

  describe('create', () => {
    it('should process new entity', async () => {
      repository.save.mockReturnValueOnce(mockDatabaseRecommendationEntity);
      expect(await service.create(
        mockClientMetadata,
        mockDatabaseRecommendationEntity.name,
      )).toEqual(mockDatabaseRecommendation);
    });
  });

  describe('list', () => {
    it('should get list of recommendations', async () => {
      mockQueryBuilderGetMany.mockReturnValueOnce([{
        name: mockDatabaseRecommendation.name,
      }]);
      repository.createQueryBuilder().getCount.mockResolvedValueOnce(1);
      expect(await service.list(mockClientMetadata)).toEqual({
        recommendations: [{
          name: mockDatabaseRecommendation.name,
        }],
        totalUnread: 1,
      });
    });
  });

  describe('read', () => {
    it('should read all recommendations', async () => {
      repository.createQueryBuilder().set.mockResolvedValueOnce('ok');

      expect(await service.read(mockClientMetadata)).toEqual(undefined);
    });
  });

  describe('isExist', () => {
    it('should return true when findOneBy recommendation', async () => {
      repository.findOneBy.mockReturnValueOnce('some');

      expect(await service.isExist(mockClientMetadata, mockDatabaseRecommendation.name)).toEqual(true);
    });

    it('should return false when not findOneBy recommendation', async () => {
      repository.findOneBy.mockReturnValueOnce(null);

      expect(await service.isExist(mockClientMetadata, mockDatabaseRecommendation.name)).toEqual(false);
    });

    it('should return false when findOneBy throw error', async () => {
      repository.findOneBy.mockRejectedValue('some error');

      expect(await service.isExist(mockClientMetadata, mockDatabaseRecommendation.name)).toEqual(false);
    });
  });

  describe('recommendationVote', () => {
    it('should call "update" with the vote value', async () => {
      const { vote } = mockDatabaseRecommendationVoted;
      repository.findOne.mockReturnValueOnce(mockDatabaseRecommendationEntity);

      await service.recommendationVote(mockClientMetadata, mockDatabaseRecommendation.id, vote as Vote);
      expect(repository.update).toBeCalledWith(
        mockDatabaseRecommendationEntity.id,
        { ...mockDatabaseRecommendationEntity, vote },
      );
    });
  });
});