import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { EmojiSet } from '../models/emoji-set';
import { EmojiPersistenceService } from './emoji-persistence.service';

describe('EmojiPersistenceService', () => {
  const sampleState = {
    history: [
      {
        id: '1',
        prompt: 'test prompt',
        emojis: ['💡', '🎉', '🤝'] as EmojiSet['emojis'],
        createdAt: '2025-01-01T00:00:00.000Z'
      }
    ],
    favorites: [
      {
        id: '2',
        prompt: 'another prompt',
        emojis: ['🔥', '🚀', '✨'] as EmojiSet['emojis'],
        createdAt: '2025-01-02T00:00:00.000Z'
      }
    ]
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  function createService(platformId: unknown = 'browser') {
    TestBed.configureTestingModule({
      providers: [
        EmojiPersistenceService,
        { provide: PLATFORM_ID, useValue: platformId }
      ]
    });
    return TestBed.inject(EmojiPersistenceService);
  }

  it('returns empty arrays when storage is empty', () => {
    spyOn(window.localStorage, 'getItem').and.returnValue(null);
    const service = createService();

    expect(service.load()).toEqual({ history: [], favorites: [] });
  });

  it('hydrates persisted state when storage has data', () => {
    spyOn(window.localStorage, 'getItem').and.returnValue(JSON.stringify(sampleState));
    const service = createService();

    expect(service.load()).toEqual(sampleState);
  });

  it('falls back to empty state when JSON parsing fails', () => {
    spyOn(window.localStorage, 'getItem').and.returnValue('{not valid json');
    const service = createService();

    expect(service.load()).toEqual({ history: [], favorites: [] });
  });

  it('writes state to localStorage when running in the browser', () => {
    const setItemSpy = spyOn(window.localStorage, 'setItem');
    const service = createService();

    service.save(sampleState);

    expect(setItemSpy).toHaveBeenCalledWith('emogen_state_v1', JSON.stringify(sampleState));
  });

  it('does not write to localStorage when not in the browser', () => {
    const setItemSpy = spyOn(window.localStorage, 'setItem');
    const service = createService('server');

    service.save(sampleState);

    expect(setItemSpy).not.toHaveBeenCalled();
  });
});
