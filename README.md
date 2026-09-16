# Staff Generator v1.0.0

After Effectsで五線譜と音符を生成するScriptUIパネルです。生成結果は通常のShape Layerなので、生成後もAfter Effects上で編集できます。

実行時に外部フォント、外部JSON、追加プラグインは必要ありません。

## インストール

1. `StaffGenerator.jsx` をAfter Effectsの `Scripts/ScriptUI Panels` フォルダへ入れます。
2. After Effectsを再起動します。
3. `Window > Staff Generator` を開きます。
4. 五線譜を置きたいコンポジションをアクティブにします。
5. `Generate` を押します。

生成すると、現在のコンポジションへShape Layerが1つ追加されます。

## 基本的な使い方

通常は `Basic` タブだけで使用できます。

- `Preset`: あらかじめ用意された生成傾向を適用します。長さ・サイズ・位置などのレイアウト値は変更しません。
- `Length`: 五線譜の横幅です。
- `Staff Size`: 五線の間隔と譜面全体の基準サイズです。
- `Measures`: 小節数です。
- `Pitch Range`: 生成する音域です。
- `Rhythm Density`: 高いほど短い音価を含む密度の高いリズムを生成しやすくなります。現在の横幅に収まらない場合は内部で安全な密度まで自動調整されます。
- `Rest Amount`: 休符になるイベントの割合です。
- `Accidentals`: シャープ、フラット等の臨時記号を許可します。
- `Line Weight`: 五線、符幹、連桁、小節線、加線の太さをまとめて調整します。

### Advanced

`Advanced` タブでは細かい調整ができます。

- `Master Seed`: 同じ設定とSeedを使うと同じ結果を再現できます。
- `Melody Motion`: 0に近いほど滑らかな順次進行、100に近いほど広い跳躍を増やします。
- `Repetition`: 同じ音を繰り返す傾向です。
- `Beam`: 8分音符・16分音符の連桁を有効化します。
- `Position X / Y`: 生成Shape Layerの初期位置です。
- `Overall Scale`: 生成Shape Layer全体の初期倍率です。
- `Note Scale / Symbol Scale`: 音符とその他の楽譜記号のサイズを個別調整します。
- `Fine Line Weights`: 五線・符幹・連桁・小節線・加線の基準太さを個別調整します。

通常は個別のLine Weightを変更せず、Basicの `Line Weight` のみを使用することを推奨します。

## ボタン

- `Generate`: 現在の設定から五線譜を生成します。
- `Randomize`: Length、Staff Size、Measures、位置、Scale、Line Weightなどのレイアウト・見た目を維持したまま、Seed、音域、リズム密度、休符量、メロディ傾向、Beam、Accidentalsをランダム化します。押しただけではShape Layerは生成されません。
- `Auto Adjust`: 現在の譜面が収まるように必要なLengthを増やします。最大Lengthを超える場合のみStaff Size、Note Scale、Symbol Scaleを縮小します。Measuresは自動変更しません。
- `Reset`: 初期設定へ戻します。

## Preset

Built-in Preset:

- Default
- Simple
- Balanced
- Dense
- Calm
- Dynamic
- Chaotic

Presetは生成傾向だけを変更します。Length、Staff Size、Measures、Pitch Range、位置、Scale、Line Weightなどは保持されます。

現在の横幅に対してPresetのリズムが密すぎる場合、生成時にリズム密度だけを内部的に下げて、可能な限り現在のLengthへ収めます。この調整は同じSeedと設定に対して決定的に行われるため、結果の再現性は維持されます。

Preset対象の生成項目を手動変更すると `Custom` になります。Pitch RangeなどPresetが管理しない項目を変更してもPreset名は維持されます。

## レイアウトエラー

極端に短いLength、大きいStaff Size、多すぎるMeasuresなど、最も単純な譜面でも物理的に収まらない設定ではエラーになる場合があります。

その場合は以下を試してください。

- `Auto Adjust` を押す
- `Length` を増やす
- `Measures` を減らす
- `Staff Size` を小さくする
- Advancedの `Note Scale` / `Symbol Scale` を小さくする

音域を広くすると五線の外へ音符が出ますが、必要な加線が自動生成されるため正常です。

## ライセンス

Staff GeneratorのオリジナルコードはMIT Licenseです。詳細は [LICENSE](LICENSE) を確認してください。

このプロジェクトにはBravura由来の変換済み楽譜Glyph Outlineデータが含まれています。この第三者由来データはMITではなくSIL Open Font License 1.1の対象です。固定した変換元、バージョン、著作権表示、OFL全文は [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) を確認してください。

配布用JSXにもBravura由来データのOFL通知を埋め込んでいます。
