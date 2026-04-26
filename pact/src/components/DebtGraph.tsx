"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Member, Expense } from "@/lib/db";
import { formatRupees } from "@/lib/utils";

interface DebtGraphProps {
  members: Member[];
  expenses: Expense[];
}

export function DebtGraph({ members, expenses }: DebtGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || members.length === 0) return;

    // 1. Calculate net balances for each member
    const balances: Record<string, number> = {};
    members.forEach((m) => (balances[m.id] = 0));

    expenses.forEach((exp) => {
      balances[exp.payerId] += exp.amount;
      exp.splits.forEach((split) => {
        balances[split.memberId] -= split.amount;
      });
    });

    // 2. Simplify debts (greedy approach for MVP)
    const debtors = Object.keys(balances)
      .filter((id) => balances[id] < -0.01)
      .map((id) => ({ id, amount: -balances[id] }))
      .sort((a, b) => b.amount - a.amount);

    const creditors = Object.keys(balances)
      .filter((id) => balances[id] > 0.01)
      .map((id) => ({ id, amount: balances[id] }))
      .sort((a, b) => b.amount - a.amount);

    const links: { source: string; target: string; value: number }[] = [];

    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const amount = Math.min(debtor.amount, creditor.amount);

      links.push({
        source: debtor.id,
        target: creditor.id,
        value: amount,
      });

      debtor.amount -= amount;
      creditor.amount -= amount;

      if (debtor.amount < 0.01) i++;
      if (creditor.amount < 0.01) j++;
    }

    const nodes = members.map((m) => ({ id: m.id, name: m.name }));

    // 3. Render D3 Graph
    const width = 600;
    const height = 400;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr("viewBox", [0, 0, width, height]);

    // Define arrow markers for directed links
    svg.append("defs").selectAll("marker")
      .data(["end"])
      .join("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 25) // push arrow to edge of node
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
      .append("path")
        .attr("fill", "#6366F1")
        .attr("d", "M0,-5L10,0L0,5");

    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        "link",
        d3.forceLink(links).id((d: any) => d.id).distance(150)
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append("g")
      .attr("stroke", "#6366F1")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => Math.max(1, Math.min(5, d.value / 100)))
      .attr("marker-end", "url(#arrow)");

    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 20)
      .attr("fill", "#1E293B");

    const labels = svg
      .append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("text-anchor", "middle")
      .attr("dy", 35)
      .attr("fill", "#F8FAFC")
      .attr("font-size", "12px")
      .text((d) => d.name);

    const amounts = svg
      .append("g")
      .selectAll("text")
      .data(links)
      .join("text")
      .attr("text-anchor", "middle")
      .attr("fill", "#6366F1")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .text((d) => formatRupees(d.value));

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
      labels.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y);
      
      amounts
        .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
        .attr("y", (d: any) => (d.source.y + d.target.y) / 2 - 5);
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [members, expenses]);

  if (members.length === 0) {
    return <p className="text-muted-foreground">Add members to see the graph.</p>;
  }

  return (
    <div className="w-full flex justify-center">
      <svg ref={svgRef} className="w-full max-w-2xl h-auto" />
    </div>
  );
}
