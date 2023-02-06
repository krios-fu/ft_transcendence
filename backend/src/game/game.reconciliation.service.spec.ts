import { Test, TestingModule } from "@nestjs/testing";
import { IGameData, IInputData } from "./elements/Game";
import { GameReconciliationService } from "./game.reconciliation.service";

describe('GameReconciliationService', () => {
    let service: GameReconciliationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ GameReconciliationService ],
        }).compile();

        service = module.get<GameReconciliationService>(GameReconciliationService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe("reconcile()", () => {

        it("should reconcile 2 inputs", () => {
            const   input: IInputData[] = [
                {when: 2} as IInputData,
                {when: 10} as IInputData
            ];
            const   inputBuffer: IInputData[] = [
                {when: 20} as IInputData
            ];
            let result: [number, number];
        
            result = service.reconcile(input, inputBuffer, 50);
            expect(result).toEqual([0, 2]);
            expect(inputBuffer.length).toBe(3);
            expect(inputBuffer[0].when).toBe(2);
            expect(inputBuffer[1].when).toBe(10);
        });

        it("should not reconcile inputs", () => {
            const   input: IInputData[] = [
                {when: 55} as IInputData,
                {when: 60} as IInputData
            ];
            const   inputBuffer: IInputData[] = [
                {when: 20} as IInputData
            ];
            let result: [number, number];
        
            result = service.reconcile(input, inputBuffer, 50);
            expect(result).toEqual([-1, -1]);
            expect(inputBuffer.length).toBe(1);
        });

        it("should not process invalid inputs", () => {
            const   input: IInputData[] = [
                {when: 10} as IInputData,
                {when: 520} as IInputData
            ];
            const   inputBuffer: IInputData[] = [
                {when: 100} as IInputData
            ];
            let result: [number, number];
        
            result = service.reconcile(input, inputBuffer, 511);
            expect(result).toEqual([undefined, undefined]);
            expect(inputBuffer.length).toBe(1);
        });

        it("should process limit inputs", () => {
            const   input: IInputData[] = [
                {when: 10} as IInputData,
                {when: 520} as IInputData
            ];
            const   inputBuffer: IInputData[] = [
                {when: 100} as IInputData
            ];
            let result: [number, number];
        
            result = service.reconcile(input, inputBuffer, 510);
            expect(result).toEqual([0, 1]);
            expect(inputBuffer.length).toBe(2);
            expect(inputBuffer[0].when).toBe(10);
        });

        it("should ignore empty input", () => {
            const   input: IInputData[] = [];
            const   inputBuffer: IInputData[] = [
                {when: 100} as IInputData
            ];
            let result: [number, number];
        
            result = service.reconcile(input, inputBuffer, 510);
            expect(result).toEqual([-1, -1]);
            expect(inputBuffer.length).toBe(1);
        });

        it("should process first lagged input", () => {
            const   input: IInputData[] = [
                {when: 10} as IInputData
            ];
            const   inputBuffer: IInputData[] = [];
            let result: [number, number];
        
            result = service.reconcile(input, inputBuffer, 510);
            expect(result).toEqual([0, 1]);
            expect(inputBuffer.length).toBe(1);
        });

        it("should insert lagged inputs in order", () => {
            const   input: IInputData[] = [
                {when: 10} as IInputData,
                {when: 30} as IInputData
            ];
            const   inputBuffer: IInputData[] = [
                {when: 5} as IInputData,
                {when: 100} as IInputData
            ];
            let result: [number, number];
        
            result = service.reconcile(input, inputBuffer, 300);
            expect(result).toEqual([1, 2]);
            expect(inputBuffer.length).toBe(4);
            expect(inputBuffer[1].when).toBe(10);
            expect(inputBuffer[2].when).toBe(30);
        });

        it("should insert lagged inputs in order", () => {
            const   input: IInputData[] = [
                {when: 2} as IInputData,
                {when: 5} as IInputData,
                {when: 30} as IInputData
            ];
            const   inputBuffer: IInputData[] = [
                {when: 5} as IInputData,
                {when: 20} as IInputData
            ];
            let result: [number, number];
        
            result = service.reconcile(input, inputBuffer, 300);
            expect(result).toEqual([0, 3]);
            expect(inputBuffer.length).toBe(5);
            expect(inputBuffer[0].when).toBe(2);
            expect(inputBuffer[1].when).toBe(5);
            expect(inputBuffer[2].when).toBe(5);
            expect(inputBuffer[4].when).toBe(30);
        });
    
    });

    describe("getAffectedSnapshots()", () => {

        it("should get correct snapshots", () => {
            const   input: IInputData = {when: 10} as IInputData;
            const   snapshotBuffer: IGameData[] = [
                {when: 0} as IGameData,
                {when: 5} as IGameData,
                {when: 55} as IGameData
            ];
            let     result: IGameData[];
        
            result = service.getAffectedSnapshots(input, snapshotBuffer);
            expect(result.length).toBe(3);
            expect(result[0].when).toBe(0);
            expect(result[1].when).toBe(5);
        });

        it("should get correct snapshots", () => {
            const   input: IInputData = {when: 55} as IInputData;
            const   snapshotBuffer: IGameData[] = [
                {when: 0} as IGameData,
                {when: 5} as IGameData,
                {when: 55} as IGameData,
                {when: 105} as IGameData
            ];
            let     result: IGameData[];
        
            result = service.getAffectedSnapshots(input, snapshotBuffer);
            expect(result.length).toBe(3);
            expect(result[0].when).toBe(5);
            expect(result[2].when).toBe(105);
        });

        describe("getAffectedInputs()", () => {

            it("should get correct inputs", () => {
                const   snapshot: IGameData = {when: 10} as IGameData;
                const   inputBuffer: IInputData[] = [
                    {when: 0} as IInputData,
                    {when: 5} as IInputData,
                    {when: 55} as IInputData
                ];
                let     result: IInputData[];
            
                result = service.getAffectedInputs(snapshot, inputBuffer);
                expect(result.length).toBe(1);
                expect(result[0].when).toBe(55);
            });
    
            it("should get correct inputs", () => {
                const   snapshot: IGameData = {when: 55} as IGameData;
                const   inputBuffer: IInputData[] = [
                    {when: 0} as IInputData,
                    {when: 5} as IInputData,
                    {when: 55} as IInputData,
                    {when: 105} as IInputData
                ];
                let     result: IInputData[];
            
                result = service.getAffectedInputs(snapshot, inputBuffer);
                expect(result.length).toBe(2);
                expect(result[0].when).toBe(55);
                expect(result[1].when).toBe(105);
            });
        
        });

    });

});
