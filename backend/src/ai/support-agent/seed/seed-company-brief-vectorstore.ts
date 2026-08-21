import { FaissStore } from "@langchain/community/vectorstores/faiss";
import callGoogleGenAIEmbeddingsModel from "../models/embeddings";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import fs from "fs"


export class CompanyBriefVectorStore {
    private static readonly embeddingModel: GoogleGenerativeAIEmbeddings = callGoogleGenAIEmbeddingsModel;
    private static vectorStore: FaissStore | null = null;
    private static readonly vectorStorePath: string = "public/faiss_company_brief_vector_store"

    public static async loadCompanyBriefVectorStore() {
        const faissStore = await FaissStore.load(this.vectorStorePath, this.embeddingModel);

        this.vectorStore = faissStore;
    };
    public static async seedCompanyBriefVectorSctore() {

        const pdfLoader = new PDFLoader("public/Forever_Company_Profile_and_FAQ.pdf")

        const companyBriefPdf = await pdfLoader.load()

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 50
        })

        const splitDocs = await splitter.splitDocuments(companyBriefPdf);

        const documents = splitDocs.map((d) => ({
            pageContent: d.pageContent,
            metadata: d.metadata,
        }));

        const newVectorStore = new FaissStore(this.embeddingModel, {});

        await newVectorStore.addDocuments(documents);

        await newVectorStore.save(this.vectorStorePath);


    }
    public static async getVectorStore() {
        if (!this.vectorStore) {
            if (fs.existsSync(this.vectorStorePath)) {
                await this.loadCompanyBriefVectorStore();
            }
            else {
                this.seedCompanyBriefVectorSctore();
            }
        }
        return this.vectorStore!;
    }

    public static async refreshIfNeeded(): Promise<void> {
        const storeStat = fs.existsSync(this.vectorStorePath)
            ? fs.statSync(this.vectorStorePath)
            : null;
        const pdfStat = fs.statSync(this.vectorStorePath);

        if (!storeStat || pdfStat.mtime > storeStat.mtime) {
            await this.seedCompanyBriefVectorSctore();
            await this.loadCompanyBriefVectorStore();
        }
    }

}
