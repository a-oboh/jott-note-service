import { User } from "../../entities/user";
import { getRepository, Repository, getManager, getConnection } from "typeorm";
import { Note } from "../../entities/note";
import { HttpError } from "../../util/httpError";

export class NoteService {
  // constructor(noteRepo: Repository<Note>) {
  //   this.noteRepo = noteRepo;
  // }

  constructor(noteRepository: Repository<Note>) {
    this.noteRepo = noteRepository;
  }

  private noteRepo: Repository<Note>;

  private findNoteById = async (id: string) => {
    const noteRepo = getRepository(Note);

    const note = await noteRepo.findOne(id);

    if (!note) {
      throw new HttpError(`note with id ${id} not found`, 404);
    }

    return note;
  };

  getNoteById = async (id: string) => {
    const note = await this.findNoteById(id);

    if (note) {
      return note;
    }

    throw new HttpError(`note does not exist`, 404);
  };

  getSingleNote = async (user: User, noteId: string) => {
    const noteRepo = getRepository(Note);

    try {
      if (!noteId) {
        throw new HttpError("no note id", 500);
      }

      const note = await noteRepo.findOneOrFail({ id: noteId, owner: user });

      return note;
    } catch (err) {
      throw new HttpError(err, 500);
    }
  };

  getNotesByOwner = async (user: User) => {
    try {
      const noteRepo = getRepository(Note);

      const notes = await noteRepo.find({ owner: user });

      if (!notes) {
        throw new HttpError(`note for user ${user.id} not found`, 404);
      }

      return notes;
    } catch (e) {
      throw new HttpError(e);
    }
  };

  createNote = async (data: Note) => {
    const noteRepo = getRepository(Note);

    try {
      const note = noteRepo.create(data);

      const newNote = await noteRepo.save(note);

      return newNote as unknown as Note;
    } catch (e) {
      throw new HttpError(e.message, 500);
    }
  };

  updateNote = async (data: Note) => {
    const noteRepo = getRepository(Note);

    try {
      await getManager().transaction("SERIALIZABLE", async (entityManager) => {
        entityManager.save(data);
      });

      const newNote = await noteRepo.save(data);

      return newNote as unknown as Note;
    } catch (e) {
      throw new HttpError(e.message, 500);
    }
  };

  deleteNote = (id: string) => {
    try {
      const noteRepo = getRepository(Note);
      // const noteToRemove = await this.findNoteById(id);

      return noteRepo.softDelete(id);
    } catch (e) {
      throw new HttpError(e, 500);
    }
  };

  restoreNote = (id: string) => {
    try {
      const noteRepo = getRepository(Note);
      // const noteToRestore = await this.findNoteById(id);

      return noteRepo.restore(id);
    } catch (e) {
      throw new HttpError(e, 500);
    }
  };
}
