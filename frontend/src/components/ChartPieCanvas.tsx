import React, { useEffect, useRef } from 'react';
import { Chart, ArcElement, Tooltip, Legend, PieController } from 'chart.js';

type Props = {
    labels: string[];
    data: number[];
    colors?: string[];
    width?: number;
    height?: number;
};

Chart.register(PieController, ArcElement, Tooltip, Legend);

const ChartPieCanvas: React.FC<Props> = ({ labels, data, colors, width = 300, height = 150 }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartRef = useRef<Chart | null>(null);

    const labelsKey = labels ? labels.join(',') : '';
    const dataKey = data ? data.join(',') : '';
    const colorsKey = colors ? colors.join(',') : '';

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Destroy any Chart instance already attached to this canvas
        const existing = Chart.getChart(canvas as HTMLCanvasElement);
        if (existing) {
            try { existing.destroy(); } catch (e) {}
        }

        chartRef.current = new Chart(ctx, {
            type: 'pie',
            data: {
                labels,
                datasets: [
                    {
                        data,
                        backgroundColor: colors || ['#C4532A', '#F6B89A', '#A3D2CA', '#E9C46A', '#90BE6D'],
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            },
        });

        return () => {
            if (chartRef.current) {
                try { chartRef.current.destroy(); } catch (e) {}
                chartRef.current = null;
            }
        };
    }, [labelsKey, dataKey, colorsKey]);

    return (
        <div style={{ width, height }}>
            <canvas ref={canvasRef} />
        </div>
    );
};

export default ChartPieCanvas;
