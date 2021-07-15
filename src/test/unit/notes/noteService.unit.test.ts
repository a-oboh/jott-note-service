import { Note } from "entities/note";
import { NoteService } from "services/notes/noteService";
import { Repository } from "typeorm";
import * as typeorm from "typeorm";

describe("note service test suite", () => {
  let mockNote;

  beforeEach(() => {
    mockNote = new Note();

    (typeorm as any).getRepository = jest.fn().mockReturnValue({
      findOne: () => Promise.resolve(mockNote),
    });
  });

  // jest.mock('typeorm', () => ({ getRepository: jest.fn() }));

  test("should get a single note from getNoteById", async () => {
    const noteSvc: NoteService = new NoteService(
      (typeorm as any).getRepository(Note)
    );

    expect(await noteSvc.getNoteById("id")).toBe(mockNote);
    expect((typeorm as any).getRepository).toHaveBeenCalledTimes(1);
  });
});
