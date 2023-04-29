import * as sql from 'mssql';

export default class Database {
    initialized: boolean = false;
    config: sql.config;

    constructor(config: sql.config) {
        this.config = config;
        this.connect();
    }

    async connect() {
        try {
            await sql.connect(this.config);
            this.initialized = true;
        } catch (err) {
            console.error(err);
        }
    }

    async getRecentsSchema() {
        try {
            if (this.initialized) {
                return await sql.query`SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Recents'`;
            }
        } catch (err) {
            console.error(err);
        }
    }

    async getRecentSongs(OwnerUserID: string){
        try {
            if (this.initialized) {
                return await sql.query`SELECT SongName, SongArtist, SongAlbum, PlayedAt, SongExplicit, SongArt, OwnerUserID, SongID FROM Recents WHERE OwnerUserID = ${OwnerUserID} ORDER BY PlayedAt DESC`;
            }
        } catch (err) {
            console.error(err);
        }
    }

    async insertRecentSong(OwnerUserID: string, SongID: string, SongName: string, SongArtist: string, SongAlbum: string, SongArt: string, SongExplicit: string) {
        try {
            if (this.initialized) {
                return await sql.query`INSERT INTO Recents (OwnerUserID, PlayedAt, SongID, SongName, SongArtist, SongAlbum, SongArt, SongExplicit) VALUES (${OwnerUserID}, CURRENT_TIMESTAMP, ${SongID}, ${SongName}, ${SongArtist}, ${SongAlbum}, ${SongArt}, ${SongExplicit})`;
            }
            throw new Error('Database not initialized');
        } catch (err) {
            console.error(err);
        }
    }

    async deleteRecentSong(OwnerUserID: string) {
        try {
            if (this.initialized) {
                return await sql.query`DELETE FROM Recents WHERE OwnerUserID = ${OwnerUserID}`;
            }
            throw new Error('Database not initialized');
        } catch (err) {
            console.error(err);
        }
    }

    async getUser(UserID: string) {
        try {
            if (this.initialized) {
                return await sql.query`SELECT * FROM Users WHERE UserID = ${UserID}`;
            }
            throw new Error('Database not initialized');
        } catch (err) {
            console.error(err);
        }
    }

    async addNewUser(UserID: string) {
        try {
            if (this.initialized) {
                return await sql.query`INSERT INTO Users (UserID) VALUES (${UserID})`;
            }
            throw new Error('Database not initialized');
        } catch (err) {
            console.error(err);
        }
    }

    async addUserRefreshToken(UserID: string, RefreshToken: string) {
        try {
            if (this.initialized) {
                return await sql.query`UPDATE Users SET RefreshToken = ${RefreshToken} WHERE UserID = ${UserID}`;
            }
            throw new Error('Database not initialized');
        } catch (err) {
            console.error(err);
        }
    }
}